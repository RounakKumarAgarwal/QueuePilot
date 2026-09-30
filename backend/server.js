require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const authRoutes=require('./routes/auth');
const tokenRoutes=require('./routes/tokens');

const app=express();
app.use(cors());
app.use(express.json());