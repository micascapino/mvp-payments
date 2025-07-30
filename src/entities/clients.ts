import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ClientRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity('clients')
export class ClientAuth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'client_id', unique: true })
    clientId: string;

    @Column({ name: 'hashed_secret' })
    hashedSecret: string;

    @Column({
        type: 'enum',
        enum: ClientRole,
        default: ClientRole.USER
    })
    role: ClientRole;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'email', nullable: true })
    email: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}