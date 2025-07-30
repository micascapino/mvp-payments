import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidateTokenController } from './validateToken/validate-token-controller';
import { AuthService } from '../../services/auth.service';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { ClientAuth } from '../../entities/clients';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([ClientAuth]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { 
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ValidateTokenController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule { } 