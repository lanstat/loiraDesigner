namespace Loira{
    export abstract class BaseController{

        abstract bind(canvas: Canvas);

        abstract load(data: any);

        abstract exportData(): any;
    }
}
