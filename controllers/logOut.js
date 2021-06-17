exports.kl = async (req,res) => {
        console.log('[req]',req.session)
        req.session = null
        res.redirect('/welcome')
}


/*exports.logOut = async (req, res) => {
        res.clearCookie("mytoken")

}*/