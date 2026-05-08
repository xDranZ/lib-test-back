import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyType } from '../penalty-types/entities/penalty-type.entity';
import { User } from '../users/entities/user.entity';
import { Penalty } from './entities/penalty.entity';
import { PenaltiesController } from './penalties.controller';
import { PenaltiesService } from './penalties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Penalty, User, PenaltyType])],
  controllers: [PenaltiesController],
  providers: [PenaltiesService],
})
export class PenaltiesModule {}
