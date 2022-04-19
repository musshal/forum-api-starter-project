const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({
    commentRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCasePayload) {
    const { authorization } = useCaseHeader;
    const { content } = useCasePayload;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(authorization);

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    const newComment = new NewComment({ content });

    return this._commentRepository.addComment(newComment, owner);
  }
}

module.exports = AddCommentUseCase;
