
const yargs = require("yargs");
const fs = require('fs');
const validator = require('validator')

const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

const dataPath = './data/contact.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath,'[]','utf-8');
}
// ref chatGPT
//membuat aplikasi kontak menggunakan Node.js dan modul yargs: CRUD
// ===================================================================//

// add (C)
yargs.command({
    // command: 'add', perintah yang digunakan untuk menjalankan fungsi yang didefinisikan di dalam handler adalah add
    command:'add',
    describe:'add new contact', 
    builder:{
        name:{
            describe:'Contact Name',
            demandOption: true, 
            type:'string',
            },
        mobile:{
            describe:'contact mobile phone number',
            demandOption: true,
            type:'string',
            },
        email:{
            describe:'contact email',
            demandOption: false,
            type:'string',
            },
        },
    handler(argv){
        const contact = { name:argv.name, mobile:argv.mobile, email:argv.email,}
        console.log(contact);
        const filePath = './data/contact.json';
        const success = true;
        const file = fs.readFileSync(filePath,'utf-8')
        const contacts = JSON.parse(file);
        let cek = true;

        if(contacts.some((element)=>element.name.toLowerCase() == contact.name.toLowerCase())) {
            console.log("nama sudah ada");
            cek=false;
        }
        if(!validator.isMobilePhone(contact.mobile,'id-ID')){
            console.log("format no telp salah")
            cek=false;
        }
        // kalau email tidak di isi berarti pesan email underfine dengan menambahkan (contact.email &&)
        if(contact.email && !validator.isEmail(contact.email)){
            console.log("format email salah")
            cek=false;
        }
        if(cek){
            contacts.push(contact)
            fs.writeFileSync(filePath,JSON.stringify(contacts));
        } else {
        }
    }
});

// detail (R)
yargs.command({
    command: 'detail',
    describe: 'detail contact',
    builder: {
        name: {
            describe: 'name of the contact',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        const filePath = './data/contact.json';
        const file = fs.readFileSync(filePath, 'utf-8');
        const contacts = JSON.parse(file);

        const contact = contacts.find(contact => contact.name.toLowerCase() === argv.name.toLowerCase());
        if (contact) {
            console.log(contact);
        } else {
            console.log('Contact not found.');
        }
    }
});

//list ("R")
yargs.command({
    command: 'list',
    describe: 'list all contacts',
    handler() {
        const filePath = './data/contact.json';
        const file = fs.readFileSync(filePath, 'utf-8');
        const contacts = JSON.parse(file);

        console.log('List of contacts:');
        contacts.forEach(contact => {
            console.log(`Name: ${contact.name}, Mobile: ${contact.mobile}, Email: ${contact.email || 'Not provided'}`);
        });
    }
});

// update (U)
yargs.command({
    command: 'update',
    describe: 'Update contact by name',
    builder: {
        name: {
            describe: 'Contact Name',
            demandOption: true,
            type: 'string'
        },
        mobile: {
            describe: 'Contact mobile phone number',
            demandOption: false,
            type: 'string'
        },
        email: {
            describe: 'Contact email',
            demandOption: false,
            type: 'string'
        }
    },
    handler(argv) {
        const filePath = './data/contact.json';
        const file = fs.readFileSync(filePath, 'utf-8');
        let contacts = JSON.parse(file);

        const index = contacts.findIndex(contact => contact.name.toLowerCase() === argv.name.toLowerCase());

        if (index !== -1) {
            const updatedContact = {
                ...contacts[index],
                ...(argv.mobile && { mobile: argv.mobile }),
                ...(argv.email && { email: argv.email })
            };

            contacts[index] = updatedContact;
            fs.writeFileSync(filePath, JSON.stringify(contacts));
            console.log("Contact updated successfully.");
        } else {
            console.log("Contact not found.");
        }
    }
});

// delete (D)
yargs.command({
    command: 'delete',
    describe: 'Delete contact by name',
    builder: {
        name: {
            describe: 'Contact Name',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        const filePath = './data/contact.json';
        const file = fs.readFileSync(filePath, 'utf-8');
        let contacts = JSON.parse(file);

        const filteredContacts = contacts.filter(contact => contact.name.toLowerCase() !== argv.name.toLowerCase());

        if (filteredContacts.length < contacts.length) {
            fs.writeFileSync(filePath, JSON.stringify(filteredContacts));
            console.log("Contact deleted successfully.");
        } else {
            console.log("Contact not found.");
        }
    }
});
yargs.parse();

// modul fs untuk membaca dan menulis ke file.
// modul yargs untuk menangani argumen dari baris perintah.
// penambahkan dua perintah: add untuk menambahkan kontak baru dan list untuk menampilkan daftar kontak.
// penambahan kontak baru ke dalam file dan untuk menampilkan daftar kontak dari file.
// Kode di bawah yargs.parse() digunakan untuk memulai proses parsing argumen dari baris perintah.
// Pastikan untuk membuat direktori data dan file contacts.json di dalamnya sebelum menjalankan 