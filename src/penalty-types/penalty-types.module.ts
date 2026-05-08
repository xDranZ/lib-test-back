import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyType } from './entities/penalty-type.entity';
import { PenaltyTypesController } from './penalty-types.controller';
import { PenaltyTypesService } from './penalty-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([PenaltyType])],
  controllers: [PenaltyTypesController],
  providers: [PenaltyTypesService],
})
export class PenaltyTypesModule {}
