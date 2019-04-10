var express = require('express');
const mysql = require('mysql');
var app = express();
const bodyParser= require('body-parser');

app.set('trust proxy', true);

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hw7'
});

//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.get('/', (req, res) =>{ 
res.send('Hello World!')
})

app.get('/hw7', (req, res)=>{
    console.log(req.query.club);
    let playerQuery = 'SELECT * FROM `assists` WHERE Club = "'+ req.query.club+
                                                '" AND POS = "'+ req.query.pos+ 
                                                '" AND A = (SELECT MAX(A) from `assists` WHERE Club ="'+req.query.club+
                                                                                        '" AND POS = "'+ req.query.pos+ '")';                                                                
    
    db.query(playerQuery, (err, docs)=>{
        if(err){
            return res.status(500).send(err);
        }
        else{
            if(docs.lenght==1)
                return res.json({status: "ok", players:docs[0]})
            else{
                let count = docs.lenght;
                return res.json({status: "ok", players:docs})
            }
        }
    });   
});


app.listen(8080, '192.168.122.30');