import { Session } from '../../src/domain/entities/Session';


test('should create a new UserSession', () => {
    const userSession = Session.create('123', 3);
    expect(userSession.getUserId()).toBe('123');
    expect(userSession.getActiveStreamCount()).toBe(0);
});

test('should return an error with a less than one stream limit', () => {
    expect(() => {
        Session.create('123', -1);
    }).toThrow('Limit must be greater than 0');
});

test('should start a new stream session', () => {
    const userSession = Session.create('123', 3);
    userSession.startStream();
    expect(userSession.getActiveStreamCount()).toBe(1);
});

test('should throw an error when the stream limit is reached', () => {
    const userSession = Session.create('123', 1);
    userSession.startStream();
    expect(() => {
        userSession.startStream();
    }).toThrow('Stream limit reached');
});

test('should remove a stream session', () => {
    const userSession = Session.create('123', 3);
    userSession.startStream();
    userSession.startStream();
    userSession.removeStream(userSession.getActiveStreams()[0].getStreamId());
    expect(userSession.getActiveStreamCount()).toBe(1);
});

test('should increase the stream limit', () => {
    const userSession = Session.create('123', 1);
    userSession.startStream();
    userSession.updateStreamLimit(3);
    expect(userSession.getActiveStreamCount()).toBe(1);
});

test('should throw an error when the new limit is less than the active streams', () => {
    const userSession = Session.create('123', 3);
    userSession.startStream();
    userSession.startStream();
    expect(() => {
        userSession.updateStreamLimit(1);
    }).toThrow('Cannot update stream limit because it is less than the number of active streams');
});

test('getUserId should return the user id', () => {
    const userSession = Session.create('123', 3);
    expect(userSession.getUserId()).toBe('123');
});

test('get sessionId should return the right sessionId', () => {
    const userSession = Session.create('123', 3);
    userSession.startStream();
    expect(userSession.getActiveStreams()[0].getStreamId()).toBeTruthy();
})

test('get started at should return the started at date', () => {
    const userSession = Session.create('123', 3);
    userSession.startStream();
    expect(userSession.getActiveStreamCount()).toBe(1);
    expect(userSession.getActiveStreams()[0].getStartedAt()).toBeInstanceOf(Date);
});