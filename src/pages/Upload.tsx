import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, FileText, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUploadPage } from '@/features/upload/useUploadPage';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Upload() {
  const { t } = useLanguage();
  const {
    file,
    title,
    isUploading,
    progress,
    isDragging,
    isAddingVersion,
    setTitle,
    clearFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange,
    handleSubmit,
  } = useUploadPage();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-8 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="h-6 w-6 text-primary" />
              {isAddingVersion ? t('upload.addNewVersion') : t('upload.uploadResume')}
            </CardTitle>
            <CardDescription>
              {isAddingVersion
                ? t('upload.addVersionDescription')
                : t('upload.uploadDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isAddingVersion && (
                <div className="space-y-2">
                  <Label htmlFor="title">{t('upload.titleOptional')}</Label>
                  <Input
                    id="title"
                    placeholder={t('upload.titlePlaceholder')}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isUploading}
                  />
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
                  file && 'border-primary bg-primary/5'
                )}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-10 w-10 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="ml-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">{t('upload.dropResume')}</p>
                    <p className="text-sm text-muted-foreground mb-4">{t('upload.browse')}</p>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        {t('upload.selectFile')}
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">{t('upload.pdfLimit')}</p>
                  </>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground text-center">{t('upload.uploadingResume')}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('upload.uploading')}
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-4 w-4" />
                    {isAddingVersion ? t('upload.addVersion') : t('upload.uploadResume')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
