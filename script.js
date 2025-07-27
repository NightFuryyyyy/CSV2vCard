const file_input = document.querySelector(".file_input");
const version = document.querySelector(".version");
const export_button = document.querySelector(".export_button");
const preview_table = document.querySelector(".table_div > table");

file_input.onchange = () => {
    const csvFile = file_input.files[0];
    if (!csvFile) {
        alert('Please upload a CSV file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        preview_table.innerHTML = "";
        const table = event.target.result.trim().split('\n').map(row => row.split(',').map(val => val.trim()));
        const indices = [table[0].indexOf('Name'), table[0].indexOf('Phone')];
        if (indices[0] === -1 || indices[1] === -1) {
            alert('The CSV file must contain columns named "Name" and "Phone".');
            return;
        }
        const head_row = preview_table.insertRow();
        head_row.innerHTML = "<th>Name</th><th>Phone</th>";
        for (let i = 1; i < table.length; i++) {
            const new_row = preview_table.insertRow();
            indices.forEach(j => {
                const new_cell = new_row.insertCell();
                new_cell.appendChild(document.createTextNode(`${table[i][j]}`));
            });
        }
        export_button.onclick = () => {
            let vCardContent = '';
            if (version.value == "3.0") {
                for (let i = 1; i < table.length; i++) {
                    vCardContent +=
                        "BEGIN:VCARD\n" +
                        "VERSION:3.0\n" +
                        `FN:${table[i][indices[0]]}\n` +
                        `TEL;type=Mobile:${table[i][indices[1]]}\n` +
                        "END:VCARD\n";
                }
            } else if (version.value == "4.0") {
                for(let i = 1; i < table.length; i++) {
                    vCardContent += 
                        "BEGIN:VCARD\n" +
                        "VERSION:4.0\n" +
                        `FN:${table[i][indices[0]]}\n` +
                        `TEL;type=Mobile:${table[i][indices[1]]}\n` +
                        "END:VCARD\n";
                }
            } else {
                for(let i = 1; i < table.length; i++) {
                    vCardContent +=
                        "BEGIN:VCARD\n" +
                        "VERSION:2.1\n" +
                        `FN:${table[i][indices[0]]}\n` +
                        `TEL;CELL:${table[i][indices[1]]}\n` +
                        "END:VCARD\n";
                }
            }
            const blob = new Blob([vCardContent], {type: 'text/plain'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = csvFile.name.replace(/\.csv$/, '.vcf');
            a.click();
        }
    };
    reader.readAsText(csvFile);
};