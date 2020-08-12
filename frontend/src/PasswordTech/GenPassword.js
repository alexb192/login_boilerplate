const bcrypt = require('bcryptjs');

export default function GenPassword(password)
{
    let hashPass = bcrypt.hashSync(password, 9);
    return hashPass;
}
