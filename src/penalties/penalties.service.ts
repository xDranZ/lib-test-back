import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PenaltyType } from '../penalty-types/entities/penalty-type.entity';
import { User } from '../users/entities/user.entity';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { Penalty } from './entities/penalty.entity';

@Injectable()
export class PenaltiesService {
  constructor(
    @InjectRepository(Penalty)
    private readonly penaltiesRepository: Repository<Penalty>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PenaltyType)
    private readonly penaltyTypesRepository: Repository<PenaltyType>,
  ) {}

  async create(createPenaltyDto: CreatePenaltyDto) {
    const [user, penaltyType] = await Promise.all([
      this.usersRepository.findOne({ where: { id: createPenaltyDto.userId } }),
      this.penaltyTypesRepository.findOne({
        where: { id: createPenaltyDto.penaltyTypeId },
      }),
    ]);

    if (!user) throw new NotFoundException('User not found');
    if (!penaltyType) throw new NotFoundException('Penalty type not found');

    return this.penaltiesRepository.save(
      this.penaltiesRepository.create({
        paidAt: createPenaltyDto.paidAt
          ? new Date(createPenaltyDto.paidAt)
          : undefined,
        reason: createPenaltyDto.reason,
        user,
        penaltyType,
      }),
    );
  }

  findAll() {
    return this.penaltiesRepository.find({
      relations: { user: true, penaltyType: true, loans: true },
    });
  }

  async findOne(id: string) {
    const penalty = await this.penaltiesRepository.findOne({
      where: { id },
      relations: { user: true, penaltyType: true, loans: true },
    });
    if (!penalty) throw new NotFoundException('Penalty not found');
    return penalty;
  }

  async update(id: string, updatePenaltyDto: UpdatePenaltyDto) {
    const penalty = await this.findOne(id);

    if (updatePenaltyDto.userId) {
      const user = await this.usersRepository.findOne({
        where: { id: updatePenaltyDto.userId },
      });
      if (!user) throw new NotFoundException('User not found');
      penalty.user = user;
    }

    if (updatePenaltyDto.penaltyTypeId) {
      const penaltyType = await this.penaltyTypesRepository.findOne({
        where: { id: updatePenaltyDto.penaltyTypeId },
      });
      if (!penaltyType) throw new NotFoundException('Penalty type not found');
      penalty.penaltyType = penaltyType;
    }

    Object.assign(penalty, {
      paidAt: updatePenaltyDto.paidAt
        ? new Date(updatePenaltyDto.paidAt)
        : penalty.paidAt,
      reason: updatePenaltyDto.reason ?? penalty.reason,
    });

    return this.penaltiesRepository.save(penalty);
  }

  async remove(id: string) {
    const penalty = await this.findOne(id);
    await this.penaltiesRepository.remove(penalty);
  }
}
