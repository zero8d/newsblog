import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Otp } from 'src/schemas/otp.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { generateRandomCode } from 'src/utils/otpGen';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async sendCode(phone: string) {
    const oldOtps = await this.otpModel.find({ phone });
    const oldOtpsArr = oldOtps.map((otp) => otp.code);
    const code = generateRandomCode(oldOtpsArr);
    this.otpModel.create({ phone, code });
    // Logic for sending code as sms here 👇

    return {
      success: true,
      message: `Code has been sent as sms to phone number: ${phone}`,
      shhh_code: code,
    };
  }

  async verifyCode(phone: string, code: string) {
    const otps = await this.otpModel.find(
      { phone },
      {},
      { sort: { createdAt: 1 } },
    );
    if (otps.length == 0) {
      throw new HttpException('Code not found', HttpStatus.NOT_FOUND);
    }
    const otp = otps[0];
    if (otp.code == code) {
      await this.otpModel.findByIdAndUpdate(otp._id, { verified: true });
      return { success: true, message: 'Phone number is verified' };
    } else {
      throw new HttpException('Invlaid code', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async login(email: string, password: string) {
    const userdb = await this.usersService.findOne(email);
    const payload = { username: email, sub: userdb._id };
    if (!userdb) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const otp = await this.otpModel.findOne(
      { phone: userdb.phone },
      {},
      { sort: { _id: -1 } },
    );

    if (otp.verified) {
      if (userdb.password == password) {
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new HttpException(
          'Password is not valid',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        'Phone number is not verified',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
