import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ClientAuth } from './clients';

@Entity('accounts')
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column({ name: 'client_id', nullable: true })
    clientId: string;

    @OneToOne(() => ClientAuth, { nullable: true })
    @JoinColumn({ name: 'client_id', referencedColumnName: 'clientId' })
    client: ClientAuth;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
} 