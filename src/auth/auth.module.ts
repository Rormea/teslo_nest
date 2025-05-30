import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configservice : ConfigService) => ({
        // Asegúrate de que la variable de entorno JWT_SECRET esté configurada
        //secret: process.env.JWT_SECRET || 'defaultSecretKey',
        secret: configservice.get('JWT_SECRET') || 'defaultSecretKey',
        signOptions: {
          expiresIn: '1h', // Configura el tiempo de expiración del token
        },
      }),
    })
  ],

  exports: [
    TypeOrmModule,
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtModule, // Exporta JwtModule si necesitas usarlo en otros módulos
    ConfigModule, // Exporta ConfigModule si necesitas usarlo en otros módulos
    // Puedes exportar otros servicios o módulos que necesites
    // Por ejemplo, si tienes un UserService, podrías exportarlo aquí
  ]
})
export class AuthModule {}
