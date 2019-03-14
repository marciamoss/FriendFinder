// ===============================================================================
// ROUTING constructor
// ===============================================================================

const pageRoutes = function (pageName,app,path){
    var page=`/${pageName}`;
    if(pageName==="home"){ page="/"};

    app.get(`${page}`, function(req, res) {
        res.sendFile(path.join(__dirname, `../public/${pageName}.html`));
    });
}
module.exports=pageRoutes;
