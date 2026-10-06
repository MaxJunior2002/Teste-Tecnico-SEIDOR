import { Module } from '@nestjs/common';
import { ActiveUsageRegistry } from './active-usage-registry.js';

@Module({
  providers: [ActiveUsageRegistry],
  exports: [ActiveUsageRegistry],
})
export class CommonModule {}
