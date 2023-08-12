import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { options } from './swagger/config.js';
import { checkPhone, getToken, sendTokenToSMS } from './phone.js';
import {
    checkEmail,
    getWelcomeTemplate,
    sendTemplateToEmail,
    checkValidation,
} from './email.js';
import { opengraph } from './og.js';
import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import { Token } from './models/token.model.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use(cors());

app.get('/users', async (req, res) => {
    const result = await User.find();

    res.send(result);
});

app.post('/users', async (req, res) => {
    const { name, email, pwd, phone, prefer } = req.body;

    const isPhoneValid = await checkValidation(phone);
    if (isPhoneValid === false) {
        res.statusCode = 422;
        res.send('Phone is not Valid');
    }

    const isValid = checkEmail(email);
    if (isValid === false) return;

    const OG = await opengraph(prefer);

    const user = new User({
        name: name,
        email: email,
        pwd: pwd,
        phone: phone,
        prefer: prefer,
        og: { title: OG.title, image: OG.image, description: OG.description },
    });

    await user.save();

    const myTemplate = getWelcomeTemplate({ name });

    sendTemplateToEmail(email, myTemplate, name);
    res.send('Registration completed!!!');
});

app.get('/starbucks', async (req, res) => {
    const result = [
        { name: 'Batch Brew', kcal: 5, url: 'BatchBrew.png' },
        { name: 'Caffe Latte', kcal: 15, url: 'caffelatte.png' },
        { name: 'Caffe Mocha', kcal: 5, url: 'caffemocha.png' },
        { name: 'Cappuccino', kcal: 5, url: 'cappuccino.png' },
        {
            name: 'Dark Chocolate Latte',
            kcal: 5,
            url: 'DarkChocolateLatte.png',
        },
        { name: 'Espresso', kcal: 5, url: 'espresso.png' },
        { name: 'Iced Caffe Mocha', kcal: 5, url: 'icedcaffemocha.png' },
        {
            name: 'Iced White Chocolate Mocha',
            kcal: 5,
            url: 'WhiteChocolateMocha.png',
        },
        {
            name: 'Caramel Latte',
            kcal: 5,
            url: 'CaramelLatte.png',
        },
    ];

    res.send(result);
});

app.post('/tokens/phone', async (req, res) => {
    const myphone = req.body.qqq;

    const isValid = checkPhone(myphone);
    if (isValid === false) return;

    const mytoken = getToken();
    const isToken = await Token.exists({ phone: myphone });

    if (!isToken) {
        const token = new Token({
            token: mytoken,
            phone: myphone,
        });
        await token.save();
    } else {
        await Token.updateOne({ phone: myphone }, { token: mytoken });
    }

    sendTokenToSMS(myphone, mytoken);
    res.send('Verification completed!!!');
});

app.patch('/tokens/phone', async (req, res) => {
    const token = req.body.token;
    const myphone = req.body.phone;

    const tokenData = await Token.find({ phone: myphone });

    if (token == tokenData[0].token) {
        await Token.updateOne({ phone: myphone }, { isAuth: true });
    } else {
        res.send('Verification fail');
    }

    res.send('Verification completed!!!');
});

mongoose
    .connect('mongodb://my-database:27017/mydocker')
    .then(() => console.log('db connect success.'))
    .catch(() => console.log('db connect fail.'));

app.listen(5000, () => {
    console.log(`http://localhost:5000/`);
});
