var apiRoutes = function (app,path,fs,validUrl){

    const persons=[];let compatible;
    //get the old data in friends.js
    fs.readFile("./app/data/friends.js","utf8",function(err,olddata){
        olddata=olddata.substr(4);
        olddata=olddata.substr(0,(olddata.length)-1);
        prevdata=(olddata).split("},");
        prevdata.pop();
        for(var i=0;i<prevdata.length;i++){
            prevdata[i]=prevdata[i]+"}";
            persons.push(JSON.parse(prevdata[i]));
        }
        
        app.post("/api/friends", function(req, res) {
            
            //If image exists post the data to the server           
            var url = req.body.photo

            var imgTest= url.toLowerCase().split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/);

            if (validUrl.isUri(url) && ((imgTest.indexOf('jpg')>0) || (imgTest.indexOf('jpeg')>0) || (imgTest.indexOf('tiff')>0) || 
                                        (imgTest.indexOf('gif')>0) || (imgTest.indexOf('png')>0) || (imgTest.indexOf('bmp')>0) ))
            {
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
                    persons.push({compatible:{"name":"Boo","photo":"https://images.dog.ceo/breeds/kuvasz/n02104029_2504.jpg","scores":['2', '3', '5', '1', '3', '1', '4', '2', '4', '4']}}); 
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
            } 
            else {
                if(persons.length<1){
                    persons.push({"name":"Boo","photo":"https://images.dog.ceo/breeds/kuvasz/n02104029_2504.jpg","scores":['2', '3', '5', '1', '3', '1', '4', '2', '4', '4']}); 
                }

                for(var i=0;i<persons.length;i++){
                    if(Object.keys(persons[i])=='compatible'){
                        persons.splice(i, 1);
                    }
                }
                
                persons.push({compatible:{"name":"Your image link is invalid, Please TRY AGAIN. \nCurrently acceptable image formats:\n jpg, jpeg, tiff, png, gif, bmp\n For e.g: https://images.dog.ceo/breeds/saluki/n02091831_3222.jpg","photo":`${url}`,"scores":['NA']}}); 
                res.json(persons);
            }
                        
        });

        //send data to api links
        app.get("/api/friends", function(req, res) {    
            return res.json(persons);    
        });
    });
}
module.exports=apiRoutes;


        