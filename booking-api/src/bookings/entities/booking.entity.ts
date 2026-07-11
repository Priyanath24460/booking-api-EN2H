import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from './booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // --- Customer Info (no login required) ---
  @Column({ length: 100 })
  customerName: string;

  @Column({ length: 150 })
  customerEmail: string;

  @Column({ length: 20 })
  customerPhone: string;

  // --- Service (what they're booking) ---
  @ManyToOne(() => Service, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: number;

  // --- Appointment details ---
  @Column({ type: 'date' })
  bookingDate: string;

  @Column({ type: 'time' })
  bookingTime: string;

  // --- Status (defaults to pending) ---
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // --- Optional notes ---
  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
