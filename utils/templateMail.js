
const mail = (email,data)=>{
    const template = {
        to: email,
        subject:"Verify email",
        html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${data}">Follow link for verify email<a>`
    }
    return template
}


module.exports={
    mail
}