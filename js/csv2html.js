
var fs = require('fs');

//----------------------------------------------------------
function scanLine (a) {
    let options = null;
    if (a[6] || a[7])
        options = { indiv: a[6], camping: a[7]}
    let out = {
        section: a[0],
        title: a[1],
        anim: a[2],
        start: a[3],
        end: a[4],
        prix: a[5],
        reduit: a[8],
        options : options
    }
    return out;
}

//----------------------------------------------------------
function getSection (section, out) {
    if (!section.length) return null;
    for (let i = 0; i < out.sections.length; i++) {
        if (out.sections[i].title === section) return out.sections[i];
    }
    let newsection = { title: section, stages: []}
    out.sections.push (newsection);
    return newsection;
}

//----------------------------------------------------------
function doline (entry, out, line) {
//console.log("doline ---", entry, "----")
    let stage = entry.split(';');
    if (stage.length < 9) {
        console.error("Mauvais format ligne: 9 champs attendus,", stage.length, "champs présents")
        return null
    }
    let item = scanLine (stage);
    if (!out.header) out.header = item;
    else { 
// console.log("doline item", item);
        let section = getSection(item.section.length ? item.section : out.currentSection, out)
        if (section) {
            section.stages.push(item);
            out.currentSection = section.title;
        }
        else { console.error ("Ligne", line, ": section manquante") }
    }
}

//----------------------------------------------------------
function csv2json (csv) {
    let out = {
        header: null,
        currentSection: null,
        sections : []
    };
    let i = 0;
    let line = 1;
    let len= csv.length;
    while (i < len) {
        let eol = csv.indexOf("\n", i);
        if (eol > i) {
            doline (csv.substring(i, eol), out, line++);
            i = eol+1;
        }
    }
    return out;
}

//----------------------------------------------------------
function dohtmlline (line, data, code) {
//console.warn("dohtmlline", line)
    if (line.indexOf ("__DATA__") >= 0) {
        console.log("const gData =  " + JSON.stringify(data))
        console.log("\n\n", code)
    }
    else console.log (line)
}

//----------------------------------------------------------
function json2html (data, sections, code, index=1) {
    let i = 0;
    let line = 1;
    let len= template.length;
    while (i < len) {
        let eol = template.indexOf("\n", i);
        if (eol > i) {
            dohtmlline (template.substring(i, eol), sections, code);
            i = eol+1;
        }
        else i++;
    }
}

//----------------------------------------------------------
function csv2html (csv, code) {
    let desc = csv2json (csv);
//    console.error(JSON.stringify(desc, undefined, 4));
//    json2html (desc, desc, code, 1);
    console.log("const gData =  " + JSON.stringify(desc, undefined, 4))
    console.log("\n", code)    
}

function usage() {
    console.error ("usage: node csv2html <file.csv> <code.js>");
    process.exit(-1);
}

if (process.argv.length != 4)
    usage();

var csv = fs.readFileSync (process.argv[2], 'utf8');
var code = fs.readFileSync (process.argv[3], 'utf8');
csv2html (csv, code);