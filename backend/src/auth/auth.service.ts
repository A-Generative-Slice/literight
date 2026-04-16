import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(username: string, pass: string) {
    // 1. Maintain 'Admin/Admin' requirement
    if (username === 'Admin' && pass === 'Admin') {
      let admin = await this.userRepository.findOne({ where: { username: 'Admin' } });
      if (!admin) {
        admin = this.userRepository.create({ username: 'Admin', role: 'admin' });
        await this.userRepository.save(admin);
      }
      const payload = { username: admin.username, sub: admin.id, role: admin.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: { username: admin.username, role: admin.role }
      };
    }
    
    // 2. Persistent Student Login (Upsert)
    // For a professional LMS, we ensure the student account is saved in the DB
    let user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      user = this.userRepository.create({ username, role: 'student' });
      await this.userRepository.save(user);
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.username, role: user.role }
    };
  }
}
