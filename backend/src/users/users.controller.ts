import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('settings')
  @ApiOperation({ summary: 'Update user settings (theme, language)' })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSettings(@Request() req, @Body() settings: UpdateSettingsDto) {
    return this.usersService.updateSettings(req.user.userId, settings);
  }
}
