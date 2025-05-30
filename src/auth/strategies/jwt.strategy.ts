import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET') || 'defaultSecretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Puedes cambiar esto si quieres ignorar la expiración del token
            passReqToCallback: false, // Cambia a true si necesitas acceder al request en validate
        });
    };

    async validate(payload: JwtPayload): Promise<User> {
        const { email } = payload;

        // Aquí deberías buscar al usuario en tu base de datos por el email
        // Por ejemplo, usando un UserService o un UserRepository
        const user = await this.userRepository.findOneBy({email});

        if (!user) {
            throw new UnauthorizedException('Token is not valid - user not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }
        
        return user;
     return
    }


}