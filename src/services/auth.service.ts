import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientAuth } from '../core/entities/clients';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
    clientId: string;
    role: string;
    sub: string;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(ClientAuth)
        private clientRepository: Repository<ClientAuth>,
        private jwtService: JwtService
    ) { }

    async validateClient(clientId: string, secret: string): Promise<string | null> {
        const client = await this.clientRepository.findOne({
            where: {
                clientId,
                isActive: true
            }
        });

        if (!client) {
            return null;
        }

        const isValid = await bcrypt.compare(secret, client.hashedSecret);
        if (!isValid) {
            return null;
        }

        const payload: JwtPayload = {
            clientId: client.clientId,
            role: client.role,
            sub: client.id.toString()
        };

        return this.jwtService.sign(payload);
    }

    async validateToken(token: string): Promise<JwtPayload> {
        try {
            return this.jwtService.verify(token) as JwtPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}