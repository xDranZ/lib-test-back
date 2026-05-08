import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePenaltyTypeDto } from './dto/create-penalty-type.dto';
import { UpdatePenaltyTypeDto } from './dto/update-penalty-type.dto';
import { PenaltyTypesService } from './penalty-types.service';

@ApiTags('penalty-types')
@Controller('penalty-types')
export class PenaltyTypesController {
  constructor(private readonly penaltyTypesService: PenaltyTypesService) {}

  @Post()
  create(@Body() createPenaltyTypeDto: CreatePenaltyTypeDto) {
    return this.penaltyTypesService.create(createPenaltyTypeDto);
  }

  @Get()
  findAll() {
    return this.penaltyTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.penaltyTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePenaltyTypeDto: UpdatePenaltyTypeDto,
  ) {
    return this.penaltyTypesService.update(id, updatePenaltyTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.penaltyTypesService.remove(id);
  }
}
