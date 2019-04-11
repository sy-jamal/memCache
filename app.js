var express = require('express');
const mysql = require('mysql');
var Memcached = require('memcached');
var memcached = new Memcached('192.168.122.30:11211');
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
    let key = req.query.club+req.query.pos;
    console.log(key);

    // memcached.get(key,function(err) {
    //     console.log("inside get")
    //     if(err)
    //     {
            // console.log("err")        
            let playerQuery = 'SELECT Club as club, POS as pos,A as max_assists, Player as player FROM `assists` WHERE Club = "'+ req.query.club+
                                                '" AND POS = "'+ req.query.pos+ 
                                                '" AND A = (SELECT MAX(A) from `assists` WHERE Club ="'+req.query.club+
                                                                '" AND POS = "'+ req.query.pos+ '")ORDER BY GS DESC, Player'; 
        
            db.query(playerQuery, (err, docs)=>{
                if(err){
                    return res.status(500).send(err);
                }
                else{
                    // console.log("inside query")
                    let doc= docs[0];
                    let avgQuery = 'SELECT AVG(A) as av FROM `assists` WHERE Club = "'+ req.query.club+'" AND POS = "'+ req.query.pos+ '"';
                    db.query( avgQuery, (err, avg)=>{
                        if(err)
                            return res.status(500).send(err);
                        else
                        {   
                            // console.log("inside avg")                 
                            doc.avg_assists=avg[0].av;
                            // memcached.set(key, doc, 10, function (err) 
                            // {                     
                                // console.log("inside set memcached") 
                                console.log(doc.player);           
                                return res.send(doc);
                            // });                           
                        }                
                    })           
                }
            }); 
        // }
        // else{  
        //     console.log("inside else")
        //     memcached.touch('key', 10, function (err) {
        //         console.log("inside touch")
        //         return res.send(data);
        //     });          
               
        // }
    })
                                                                   
    // let returnQuery = 'SELECT Club as club, POS as pos,A as max_assists, Player as player, AVG(A) as avg_assists'+
    //                                             ' FROM `assists` WHERE Club = "'+ 
    //                                             req.query.club+'" AND POS = "'+ req.query.pos+ 
    //                                             '" ORDER BY A DESC, GS DESC';                                                                
    

      
// });


app.listen(8080, '192.168.122.30');