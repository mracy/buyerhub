import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('settings')
  async updateSettings(@Request() req, @Body() settings: any) {
    return this.usersService.updateSettings(req.user.id, settings);
  }
}
