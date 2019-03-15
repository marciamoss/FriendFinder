var apiRoutes = function (app,path,fs){

    const persons=[];let compatible;

    app.post("/api/friends", function(req, res) {
        compatible=[{}];
        persons.push(req.body);
        
        for(var i=0;i<persons.length;i++){
            if(Object.keys(persons[i])=='compatible'){
                persons.splice(i, 1);
            }
        }

        //check the compatibility
        if(persons.length>1){
            for(var i=0;i<((persons.length)-1);i++){
                var difference=0;
                for(var j=0;j<10;j++){
                    if(req.body.scores[j]===""){
                        req.body.scores[j]="0"
                    }
                    difference=difference+Math.abs(req.body.scores[j]-persons[i].scores[j]);
                }
                compatible.push({position:i,diff:difference});
            }

        }else{
            //adding the first data if the array is empty
            persons.push({compatible:{"name":"Boo","photo":"https://images.dog.ceo/breeds/kuvasz/n02104029_2504.jpg","scores":['2', '3', '5', '1', '3', '', '4', '2', '4', '4']}}); 
        }

        compatible.shift();
        compatible.sort(function(a,b) {return a.diff - b.diff});
        
        //person with min difference
        if(compatible.length>0){
            persons.push({compatible:persons[compatible[0].position]}); 
        }
        //end of check the compatibility

        //writes the data to friends.ja file
        fs.writeFile("./app/data/friends.js",", -"+ JSON.stringify(persons),function(err){
            if(err){
                console.log(err);
            };
                res.json(persons);
            
        })
        
            
    });

    //send data to api links
    app.get("/api/friends", function(req, res) {    
        return res.json(persons);    
    });
}
module.exports=apiRoutes;


        