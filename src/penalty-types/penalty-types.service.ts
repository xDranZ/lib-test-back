import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePenaltyTypeDto } from './dto/create-penalty-type.dto';
import { UpdatePenaltyTypeDto } from './dto/update-penalty-type.dto';
import { PenaltyType } from './entities/penalty-type.entity';

@Injectable()
export class PenaltyTypesService {
  constructor(
    @InjectRepository(PenaltyType)
    private readonly penaltyTypesRepository: Repository<PenaltyType>,
  ) {}

  create(createPenaltyTypeDto: CreatePenaltyTypeDto) {
    return this.penaltyTypesRepository.save(
      this.penaltyTypesRepository.create(createPenaltyTypeDto),
    );
  }

  findAll() {
    return this.penaltyTypesRepository.find();
  }

  async findOne(id: string) {
    const penaltyType = await this.penaltyTypesRepository.findOne({
      where: { id },
    });
    if (!penaltyType) throw new NotFoundException('Penalty type not found');
    return penaltyType;
  }

  async update(id: string, updatePenaltyTypeDto: UpdatePenaltyTypeDto) {
    const penaltyType = await this.penaltyTypesRepository.preload({
      id,
      ...updatePenaltyTypeDto,
    });
    if (!penaltyType) throw new NotFoundException('Penalty type not found');
    return this.penaltyTypesRepository.save(penaltyType);
  }

  async remove(id: string) {
    const penaltyType = await this.findOne(id);
    await this.penaltyTypesRepository.remove(penaltyType);
  }
}
