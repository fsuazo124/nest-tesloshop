import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImage } from "./product-image.entity"; 

@Entity({ name: 'products' })
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true //El nombre de un producto es único
    }) 
    title: string;

    @Column('float',{
        default: 0
    })
    price : number;

    //Otra forma de declarar una entidad
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true,
    })
    slug: string;

    @Column('int',{
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        default: [],
        array: true,
    })
    tags: string[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ProductImage, (productImage) => productImage.product,
    { cascade: true, eager: true })
    images?: ProductImage[];

    //Transforma el slug antes de una inserción
    @BeforeInsert()
    checkSlugInsert() {
        if( !this.slug ){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

        //Transforma el slug antes de una inserción
        @BeforeUpdate()
        checkSlugUpdate() {
    
            this.slug = this.slug
                .toLowerCase()
                .replaceAll(' ','_')
                .replaceAll("'",'')
        }


}
