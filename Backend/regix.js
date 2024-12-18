
const email_regix = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const password_regix = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export default {
    email_regix,
    password_regix
}
