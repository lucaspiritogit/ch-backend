import { Controller, Get, Post, Delete, Put, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { HttpException, HttpStatus, Param } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
