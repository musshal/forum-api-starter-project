class DeleteCommentUseCase {
  constructor({
    commentRepository,
    authenticationRepository,
    authenticationTokenManager,
  }) {
    this._commentRepository = commentRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCaseHeader, useCaseParam) {
    const { authorization } = useCaseHeader;
    const { commentId } = useCaseParam;

    const accessToken = await this._authenticationRepository.checkAvailabilityToken(authorization);

    await this._authenticationTokenManager.verifyRefreshToken(accessToken);

    const { id: owner } = await this._authenticationTokenManager.decodePayload(
      accessToken,
    );

    await this._commentRepository.verifyCommentPublisher(commentId, owner);

    return this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
