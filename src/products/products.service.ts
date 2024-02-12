import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}


  async create(createProductDto: CreateProductDto) {
    try {

      //Alternativa a transformar el slug
      // if ( !createProductDto.slug ) {
      //   createProductDto.slug = createProductDto.title
      //   .toLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // } else {
      //   createProductDto.slug = createProductDto.slug
      //   .toLowerCase()
      //   .replaceAll('','_')
      //   .replaceAll("'",'')
      // }

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );

      return product;
      
    } catch (error) {
      this.handleDbExceptions(error)
    }

  }

  async findAll( paginationDto: PaginationDto) {

    const {limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // Todo: relaciones
    })

    if( products.length === 0 ){
      throw new NotFoundException({
        message: 'Products not found',
        statusCode: 404,
        products : []
      })
    }

    return products;
  }

  async findOne(term: string) {

    let product: Product;

    if( isUUID(term)){
      product = await this.productRepository.findOneBy({ id: term })
    }else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
      .where('LOWER(title) = LOWER(:title) or slug =:slug', {
        title: term, 
        slug: term.toLowerCase(),
      }).getOne();
    }

    if( !product )
      throw new NotFoundException({
        message: 'Product not found',
        statusCode: 404,
        product : []
      })
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.findOne( id )
  
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
  
    Object.assign(product, updateProductDto);
  
    try {
      await this.productRepository.save(product);
  
      return product;
    } catch (error) {
      this.handleDbExceptions(error)
    }

  }
  
  async remove(id: string) {

    await this.findOne( id );

    await this.productRepository.delete({ id: id })

    return {
      message: `Product with id ${id} is deleted`,
      statusCode: 200,
    }
  }

  private handleDbExceptions( error: any ){
    if( error.code === '23505' )
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server log')
  }

}
