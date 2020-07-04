import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BaseController } from '@src/app/Common/Base/Controller/index.controller';
import { UseCrud } from '@src/common/decorators/crud.decorator';
import { ACL } from '@src/common/decorators/acl.decorator';
import { AccessControlList } from '@src/common/enums/accessControlList';
import { CurrentUser } from '@src/common/decorators/currentUser.decorator';
import { Override, ParsedRequest, CrudRequest } from '@nestjsx/crud';
import { PostRepository } from '../Repository/index.repository';
import { PostService } from '../Service/index.service';
import { Post } from '../post.entity';

@UseCrud(Post, {
  routes: {
    exclude: ['getOneBase', 'deleteOneBase']
  }
})
@ApiTags('posts')
@Controller('posts')
export class PostController extends BaseController<Post> {
  constructor(
    public service: PostService,
    private readonly repository: PostRepository
  ) {
    super(repository);
  }

  /**
   * Override CRUD Method
   */

  /**
   * GET MANY (NO AUTH)
   * @param req
   */
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  /**
   * GET TRASH
   * @param user CurrentUser
   */
  @Get('trashed')
  @ACL(AccessControlList.DEFAULT)
  @ApiOperation({ summary: 'Get deleted Record' })
  async getTrashedOverride(@CurrentUser() user: any): Promise<any> {
    return this.getTrashed(user);
  }

  /**
   * GET ONE
   * @param id Param
   * @param user CurrentUser
   */
  @ApiOperation({ summary: 'Get one Record' })
  @Override('getOneBase')
  @Get(':id')
  async GetOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return this.GetOneBase(id);
  }
}
