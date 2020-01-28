// Initialisierung externe Module
const iptables = require("iptables");
const fs = require('fs');
const exec = require('child_process').exec



// Initialisierung Variablen & Objekte
let config = new Object();
let ipaddr = new Object();
ipaddr.role = new Object();
ipaddr.role.bs = new Object();
ipaddr.role.bu = new Object();

// IP Tables leeren
exec('sudo iptables -F', (err, stdout, stderr) => console.log(stdout));


// Konfig File einlesen und IP Adressen setzen
fs.readFile('config.json', (err, data) => {
    if (err) throw err;
    config = JSON.parse(data);
    console.log(config.ipaddress_role_bs_lng);
    
    ipaddr.role.bs.lng = config.ipaddress_role_bs_lng;
    ipaddr.role.bs.muc = config.ipaddress_role_bs_muc;
    ipaddr.role.bs.bre = config.ipaddress_role_bs_bre;
    ipaddr.role.bs.kar = config.ipaddress_role_bs_kar;

    ipaddr.role.bu.lng = config.ipaddress_role_bu_lng;
    ipaddr.role.bu.muc = config.ipaddress_role_bu_muc;
    ipaddr.role.bu.bre = config.ipaddress_role_bu_bre;
    ipaddr.role.bu.kar = config.ipaddress_role_bu_kar;

    document.getElementById("rolebslngip").value = ipaddr.role.bs.lng;
    document.getElementById("rolebsmucip").value = ipaddr.role.bs.muc;
    document.getElementById("rolebsbreip").value = ipaddr.role.bs.bre;
    document.getElementById("rolebskarip").value = ipaddr.role.bs.kar;

    document.getElementById("rolebulngip").value = ipaddr.role.bu.lng;
    document.getElementById("rolebumucip").value = ipaddr.role.bu.muc;
    document.getElementById("rolebubreip").value = ipaddr.role.bu.bre;
    document.getElementById("rolebukarip").value = ipaddr.role.bu.kar;
});


//FUNKTIONEN
//Funktion IP Tables regeln setzen nach Klick auf Button 
function ipt (type, system, location1, location2) 
{
    if((document.getElementById(type+system+location1+location2).className.indexOf("active"))!=-1)
      {
           iptables.drop({
            chain : 'FORWARD',
            dst: eval("ipaddr."+type+"."+system+"."+location1),
            src: eval("ipaddr."+type+"."+system+"."+location2),
            sudo : true
                });
        iptables.drop({
            chain : 'FORWARD',
            src: eval("ipaddr."+type+"."+system+"."+location1),
            dst: eval("ipaddr."+type+"."+system+"."+location2),
            sudo : true
                 });
      }
      else
      {
        iptables.deleteRule({
            target: 'DROP',
            chain : 'FORWARD',
            src: eval("ipaddr."+type+"."+system+"."+location1),
            dst: eval("ipaddr."+type+"."+system+"."+location2),
            sudo : true
    
          });

          iptables.deleteRule({
            target: 'DROP',
            chain : 'FORWARD',
            dst: eval("ipaddr."+type+"."+system+"."+location1),
            src: eval("ipaddr."+type+"."+system+"."+location2),
            sudo : true
              });
      }
}

//Funktion Klick auf Speichern Button
function save() 
{
    //Eingegebene Werte übernehmen
    ipaddr.role.bs.lng = document.getElementById("rolebslngip").value;
    ipaddr.role.bs.muc = document.getElementById("rolebsmucip").value;
    ipaddr.role.bs.bre = document.getElementById("rolebsbreip").value;
    ipaddr.role.bs.kar = document.getElementById("rolebskarip").value;
    
    ipaddr.role.bu.lng = document.getElementById("rolebulngip").value;
    ipaddr.role.bu.muc = document.getElementById("rolebumucip").value;
    ipaddr.role.bu.bre = document.getElementById("rolebubreip").value;
    ipaddr.role.bu.kar = document.getElementById("rolebukarip").value;

    //Eingegebene Werte in Config File schreiben
    config.ipaddress_role_bs_lng = ipaddr.role.bs.lng;
    config.ipaddress_role_bs_muc = ipaddr.role.bs.muc;
    config.ipaddress_role_bs_bre = ipaddr.role.bs.bre;
    config.ipaddress_role_bs_kar = ipaddr.role.bs.kar;

    config.ipaddress_role_bu_lng = ipaddr.role.bu.lng;
    config.ipaddress_role_bu_muc = ipaddr.role.bu.muc;
    config.ipaddress_role_bu_bre = ipaddr.role.bu.bre;
    config.ipaddress_role_bu_kar = ipaddr.role.bu.kar;

    fs.writeFileSync('config.json', JSON.stringify(config, null, 2), (err) => {
        if (err) throw err;
         });

    // bestehende Einstellungen zurücksetzen
    exec('sudo iptables -F', (err, stdout, stderr) => console.log(stdout));

    document.getElementById("rolebslngmuc").classList.add("active");
    document.getElementById("rolebslngbre").classList.add("active");
    document.getElementById("rolebslngkar").classList.add("active");
    
    document.getElementById("rolebsmucbre").classList.add("active");
    document.getElementById("rolebsmuckar").classList.add("active");
    
    document.getElementById("rolebsbrekar").classList.add("active");

    document.getElementById("rolebulngmuc").classList.add("active");
    document.getElementById("rolebulngbre").classList.add("active");
    document.getElementById("rolebulngkar").classList.add("active");
    
    document.getElementById("rolebumucbre").classList.add("active");
    document.getElementById("rolebumuckar").classList.add("active");
    
    document.getElementById("rolebubrekar").classList.add("active");

}
 


