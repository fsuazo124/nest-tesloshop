import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity"; 

@Entity({ name: 'products_images' })
export class ProductImage{

    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.images,
    { onDelete: 'CASCADE' }
    )
    product: Product

}