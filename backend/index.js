import express from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import {options} from './swagger/config.js'// index.js
import cors from 'cors';
// config.js



const app = express()
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));
app.use(cors()); 


app.get('/users', (req, res) => {
  // 1. 데이터를 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
	const result = [
       
{ 
	email : "aaa@gmail.com", 
	name : "철수",
	phone : "010-1234-5678",
	personal : "220110-2222222",
	prefer : "https://naver.com"
},
{ 
	email : "aaa@gmail.com", 
	name : "철수",
	phone : "010-1234-5678",
	personal : "220110-2222222",
	prefer : "https://naver.com"
},
{ 
	email : "aaa@gmail.com", 
	name : "철수",
	phone : "010-1234-5678",
	personal : "220110-2222222",
	prefer : "https://naver.com"
}]

  // 2. 꺼내온 결과 응답 주기
  res.send(result);
});

app.get('/starbucks', (req, res) => {
    // 1. 데이터를 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
      const result = [
         
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
        { name: '아메리카노', kcal: 5 },
  ]
  
    // 2. 꺼내온 결과 응답 주기
    res.send(result);
  });



app.listen(5000, () => {
  console.log("백엔드 API 서버가 켜졌어요!!!");
  console.log(`http://localhost:5000/`)
});