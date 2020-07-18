import { AZURE_STORAGE_MODULE_OPTIONS, AzureMulterStorageService, AzureStorageOptions, AzureStorageService } from '@nestjs/azure-storage/dist';
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

export interface AzureStorageAsyncOptions {
  useExisting?: Type<AzureStorageOptionsFactory>;
  useClass?: Type<AzureStorageOptionsFactory>;
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AzureStorageOptions> | AzureStorageOptions;
  inject?: any[];
}

export interface AzureStorageOptionsFactory {
  createAzureStorageOptions():
    | AzureStorageOptions
    | Promise<AzureStorageOptions>;
}

@Module({
  providers: [
    AzureMulterStorageService,
    AzureStorageService,
  ],
  exports: [
    AzureMulterStorageService,
    AzureStorageService,
    AZURE_STORAGE_MODULE_OPTIONS,
  ],
})
export class AzureModule {
  static withConfig(
    optionsProvider: Provider<AzureStorageOptions>,
  ): DynamicModule {
    return {
      module: AzureModule,
      providers: [
        optionsProvider,
      ],
    };
  }

  static withConfigAsync(options: AzureStorageAsyncOptions): DynamicModule {
    return {
      module: AzureModule,
      providers: [...this.createAsyncConfigProviders(options)],
      imports: [...options.imports],
    };
  }

  private static createAsyncConfigProviders(
    options: AzureStorageAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncConfigProvider(options)];
    }

    return [
      this.createAsyncConfigProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncConfigProvider(
    options: AzureStorageAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AZURE_STORAGE_MODULE_OPTIONS,
        useFactory: async (...args: any[]) => await options.useFactory(...args),
        inject: options.inject || [],
      };
    }
    return {
      provide: AZURE_STORAGE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AzureStorageOptionsFactory) =>
        await optionsFactory.createAzureStorageOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
