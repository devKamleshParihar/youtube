import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique:true})
    username:string

    @Column()
    password:string

    @Column({ type: 'varchar', length: 255 ,unique:true})
    email: string;

    @Column({ type: 'boolean', default: false })
  status: boolean; // Default value is false, will be set to true upon successful OTP verification

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null; // OTP for login verification
}