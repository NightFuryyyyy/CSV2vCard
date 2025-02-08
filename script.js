let rows, nameIndex, phoneIndex, csvFile = "";
function uploaded() {
    csvFile = document.querySelector("input[type=file]").files[0];
    if(!csvFile) {
        alert('Please upload a CSV file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        rows = event.target.result.trim().split('\n').map(row => row.split(',').map(val => val.trim()));
        nameIndex = rows[0].indexOf('Name');
        phoneIndex = rows[0].indexOf('Phone');
        if(nameIndex === -1 || phoneIndex === -1) {
            alert('The CSV file must contain columns named "Name" and "Phone".');
            return;
        }
        let table = `<table><tr><th>Name</th><th>Phone</th></tr>`;
        for(let i = 1; i < rows.length; i++) table += `<tr><td>${rows[i][nameIndex]}</td><td>${rows[i][phoneIndex]}</td></tr>`;
        table += "</table>";
        document.getElementById("table").innerHTML = table;
    }
    reader.readAsText(csvFile);
}

function convertToVcf() {
    if(csvFile == "") return;
    let vCardContent = '';
    if(document.querySelector("select").value == "3.0") {
        for(let i = 1; i < rows.length; i++) vCardContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${rows[i][nameIndex]}\nTEL;type=Mobile:${rows[i][phoneIndex]}\nEND:VCARD\n`;
    } else if(document.querySelector("select").value == "4.0") {
        for(let i = 1; i < rows.length; i++) vCardContent += `BEGIN:VCARD\nVERSION:4.0\nFN:${rows[i][nameIndex]}\nTEL;type=Mobile:${rows[i][phoneIndex]}\nEND:VCARD\n`;
    } else {
        for(let i = 1; i < rows.length; i++) vCardContent += `BEGIN:VCARD\nVERSION:2.1\nFN:${rows[i][nameIndex]}\nTEL;CELL:${rows[i][phoneIndex]}\nEND:VCARD\n`;
    }    
    const blob = new Blob([vCardContent], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = csvFile.name.replace(/\.csv$/, '.vcf');
    a.click();
}
