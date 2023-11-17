# @am92/aws-s3

[![npm version](https://img.shields.io/npm/v/@am92/aws-s3?style=for-the-badge)](https://www.npmjs.com/package/@am92/aws-s3)&nbsp;
[![ECMAScript Module](https://img.shields.io/badge/ECMAScript-Module%20Only-red?style=for-the-badge)](https://nodejs.org/api/esm.html)&nbsp;
[![License: MIT](https://img.shields.io/npm/l/@am92/aws-s3?color=yellow&style=for-the-badge)](https://opensource.org/licenses/MIT)&nbsp;
[![Vulnerabilities: Snyk](https://img.shields.io/snyk/vulnerabilities/npm/@am92/aws-s3?style=for-the-badge)](https://security.snyk.io/package/npm/@am92%2Faws-s3)&nbsp;
[![Downloads](https://img.shields.io/npm/dy/@am92/aws-s3?style=for-the-badge)](https://npm-stat.com/charts.html?package=%40m92%2Faws-s3)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@am92/aws-s3?style=for-the-badge)](https://bundlephobia.com/package/@am92/aws-s3)

<br />

## Table of Content
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Creating an OtpSdk Instance](#creating-an-aws-s3sdk-instance)
- [Contributors](#contributors)
- [Resources](#resources)
- [License](#license)

<br />

## Installation
```bash
$ npm install --save @am92/aws-s3
```
<br />

## Environment Variables
The following environment variables need to be set to work with this package:
```sh
##### AWS S3 SDK Config
export S3_ENABLED='false'
export S3_REGION='ap-south-1'
export S3_BUCKET=''
export S3_PRESIGNED_EXPIRY_IN_SECS='300'
```

*Note:*
* *If 'S3_ENABLED' is set to 'true', 'S3_BUCKET' is required*
* *Variables where values have been defined can be omitted from being defined as the mentioned values are internally defaulted.*

<br />

## Creating an OtpSdk Instance
```javascript
import S3Sdk from '@am92/aws-s3'

const s3Sdk = new S3Sdk()
export default s3Sdk
```
*In this case, configuration values are read from environment variables*

If you wish to pass your custom 'config' to OtpSdk Class, then you can build it as follows:

```javascript
import S3Sdk from '@am92/aws-s3'

const config = {
  BUCKET: '',
  PRESIGNED_EXPIRY_IN_SECS: 300,
  CONNECTION_CONFIG: {
    region: ''
  }
}

const s3Sdk = new S3Sdk(config)
export default s3Sdk
```
*In this case, configuration values are defaulted from environment variables. Thus partial config can be passed to the S3Sdk Class.*

<br />

## Contributors
<table>
  <tbody>
    <tr>
      <td align="center">
        <a href='https://github.com/ankitgandhi452'>
          <img src="https://avatars.githubusercontent.com/u/8692027?s=400&v=4" width="100px;" alt="Ankit Gandhi"/>
          <br />
          <sub><b>Ankit Gandhi</b></sub>
        </a>
      </td>
      <td align="center">
        <a href='https://github.com/agarwalmehul'>
          <img src="https://avatars.githubusercontent.com/u/8692023?s=400&v=4" width="100px;" alt="Mehul Agarwal"/>
          <br />
          <sub><b>Mehul Agarwal</b></sub>
        </a>
      </td>
    </tr>
  </tbody>
</table>

<br />

## Resources
* [AWS S3 Client](https://www.npmjs.com/package/@aws-sdk/client-s3)
* [AWS S3 Request Presigner](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner)

<br />

## License
* [MIT](https://opensource.org/licenses/MIT)


<br />
<br />
