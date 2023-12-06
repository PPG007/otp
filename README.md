# otp

This repository implements TOTP and HOTP generation that defined in [RFC6238](https://datatracker.ietf.org/doc/html/rfc6238) and [RFC4226](https://datatracker.ietf.org/doc/html/rfc4226)。

## Install

use npm:

```shell
npm install @ppg007/otp
```

use yarn:

```shell
yarn add @ppg007/otp
```

## TOTP

```ts
import { totp } from '@ppg007/otp';

const genTOTP = (): string => {
  return totp({
    digits: 6,
    period: 30,
    algorithm: 'SHA-1',
    secret: 'secret key',
  });
};
```

## HOTP

```ts
import { hotp } from '@ppg007/otp';

const genHOTP = (counter: number): string => {
  return hotp({
    digits: 6,
    counter,
    algorithm: 'SHA-1',
    secret: 'secret key',
  });
};
```

## Options

Common Options:

|Option|Type|Describe|Values|
|------|----|--------|------|
|algorithm|string|the hash algorithm usage when calculate the otp|'SHA-1', 'SHA-256', 'SHA-512'; default value is 'SHA-1'|
|digits|number|the otp length|default value is 6, some 2FA App only support 6 length OTP|
|secret|string|the hash secret key|must be a base32 encoded string|

TOTP Options:

|Option|Type|Describe|Values|
|------|----|--------|------|
|period|number|the TOTP valid period second |default value 30, some 2FA App only support 30s|

HOTP Options:

|Option|Type|Describe|Values|
|------|----|--------|------|
|counter|number|the HOTP counter initial value|default value is 0|
