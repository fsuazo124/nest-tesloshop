import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
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

    
}
