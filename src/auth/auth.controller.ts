import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDeco } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/raw-headers.decorator';
import { UseRoleGuard } from './guards/use-role/use-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginuserdto: LoginUserDto) {
    return this.authService.loginUser(loginuserdto);
  }

  @Get('private')
  @UseGuards( AuthGuard() ) // Protege esta ruta con el guard de JWT
  testingPrivateRoute(
    @GetUserDeco() user: User,
    @GetUserDeco('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
  ){
    return {
      ok: true,
      message: 'You are authenticated and can access this private route',
      user: user,
      userEmail:userEmail,
      rawHeaders: rawHeaders,
    }
  };

  @Get('private2')
  @SetMetadata('roles', ['admin','super-user']) // Puedes usar SetMetadata para agregar metadatos personalizados, como roles
  @UseGuards( AuthGuard(), UseRoleGuard) // Protege esta ruta con el guard de JWT
  testingPrivateRoute2(
    @GetUserDeco() user: User,
    @GetUserDeco('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
  ){
    return {
      ok: true,
      message: 'You are authenticated and can access this private route',
      user: user,
      userEmail:userEmail,
      rawHeaders: rawHeaders,
    }
  }

/*   @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}
