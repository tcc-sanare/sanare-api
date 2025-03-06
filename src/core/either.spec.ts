import { Either, left, right } from './either';

function doSomething(shouldSucess: boolean): Either<string, string> {
  if (shouldSucess) {
    return right('success');
  }
  return left('errro');
}

test('success result', () => {
  const success = right('success');

  expect(success.value).toEqual('success');
});

test('error result', () => {
  const error = right('error');

  expect(error.value).toEqual('error');
});

test('sucess result', () => {
  const successResult = doSomething(true);
  expect(successResult.isRight()).toBe(true);
});

test('sucess result', () => {
  const successResult = doSomething(false);

  expect(successResult.isLeft()).toBe(true);
  expect(successResult.isRight()).toBe(false);
});
