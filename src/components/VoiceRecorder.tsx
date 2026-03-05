import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash2 } from "lucide-react";
import { showError } from "@/utils/toast";

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
}

const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Convert blob to base64 for storage in localStorage
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
          onRecordingComplete(base64data);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      showError("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-secondary/50 rounded-2xl border-2 border-dashed border-muted-foreground/20 w-full overflow-hidden">
      {!audioUrl ? (
        <Button
          type="button"
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center p-0"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Square size={24} className="animate-pulse" /> : <Mic size={24} />}
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <audio src={audioUrl} controls className="w-full h-10 min-w-0" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setAudioUrl(null);
              onRecordingComplete('');
            }}
            className="text-destructive shrink-0 h-10 w-10 sm:h-8 sm:w-8 hover:bg-destructive/10"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      )}
      <p className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
        {isRecording ? "Recording..." : audioUrl ? "Recording ready" : "Tap to record voice note"}
      </p>
    </div>
  );
};

export default VoiceRecorder;