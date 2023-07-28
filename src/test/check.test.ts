import { expect } from 'chai';
import { AddressesModel, UserModel } from '../api/schema';
import { isDefined } from './is-defined';
import { Address } from '../data/entity/address';
import { User } from '../data/entity/user';

export function checkAddress(response: AddressesModel[], addressesDb: Address[]) {
  expect(response.length).to.be.eq(addressesDb.length);

  for (const address of response) {
    const addressDb = addressesDb?.find(({ id }) => id === address.id);

    isDefined(addressDb);
    expect(address.cep).to.be.eq(addressDb.cep);
    expect(address.city).to.be.eq(addressDb.city);
    expect(address.state).to.be.eq(addressDb.state);
    expect(address.street).to.be.eq(addressDb.street);
    expect(address.complement).to.be.eq(addressDb.complement);
    expect(address.streetNumber).to.be.eq(addressDb.streetNumber);
    expect(address.neighborhood).to.be.eq(addressDb.neighborhood);
  }
}

export function checkUsers(response: UserModel[], users: User[], limit = 10, skip = 0) {
  expect(response.length).to.be.eq(limit);

  for (let i = 0; i < response.length; i++) {
    const userDb = users[i + skip];
    const userResponse = response[i];

    isDefined(userDb);
    expect(userResponse.name).to.be.eq(userDb.name);
    expect(userResponse.email).to.be.eq(userDb.email);
    expect(userResponse.birthDate).to.be.eq(userDb.birthDate);

    checkAddress(userResponse.addresses, userDb.addresses);
  }
}
