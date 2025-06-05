import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcr from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
// import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    // Aquí podrías inyectar servicios como UserService, JwtService, etc.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService
  ) {}


  async createUser(createUserDto: CreateUserDto) {

    
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create(
        {
          ...userData,
          password: bcr.hashSync(password, 10), // Encriptar la contraseña con bcrypt
        }
      );
      await this.userRepository.save(user);
      delete user.password; // Eliminar la contraseña del objeto de respuesta
      return {
        ...user,
        token: this.getJwtToken({ id:user.id }), // Generar el token JWT
      } 
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async loginUser(loginuserdto: LoginUserDto) {

    const { email, password } = loginuserdto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true}, // Selecciona los campos necesarios
      });

      if (!user) {
        throw new UnauthorizedException('Credentials are not valid - email');
      }

      if (!bcr.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid - password');
      }
 
      // Eliminar la contraseña del objeto de respuesta
      return {
        ...user,
        token: this.getJwtToken({ id:user.id }), // Generar el token JWT
      } 
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  
async checkAuthStatus(user: User) {
  try {
    const { id, email, fullname } = user;
    // Aquí puedes realizar cualquier lógica adicional que necesites
    return {
      ok: true,
      ...user,
      token: this.getJwtToken({ id }), // Generar el token JWT
    };
  } catch (error) {
    this.handleDBExceptions(error);
  }
}
// Aquí puedes implementar los métodos findAll, findOne, update y remove si es necesario

/*   findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  } */

    private handleDBExceptions(error: any):never {
      if (error.code === '23505') {
      // Unique constraint violation
      throw new BadRequestException(error.detail || 'User already exists');
      }
      this.logger.error(error);
      console.log(error)
      throw new InternalServerErrorException(`Can't create product - ${error.message || 'check server logs'}`); 
    };

    private getJwtToken( payload: JwtPayload ): string {
        // Aquí deberías implementar la lógica para generar un token JWT
        // Por ejemplo, usando el JwtService de NestJS
        const token = this.jwtService.sign(payload);
        return token; 
    }
    
}
